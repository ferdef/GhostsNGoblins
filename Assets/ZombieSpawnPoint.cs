using System.Collections;
using System.Collections.Generic;
using Unity;
using UnityEngine;

public class ZombieSpawnPoint : MonoBehaviour
{
    public GameObject PrefabZombie;
    public float SpawnPeridoSecs = 10;
    public float ActivationThresholdM = 30.0f;

    private float mTimeToNextSpawn = 0;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        mTimeToNextSpawn -= Time.deltaTime;
        if ((mTimeToNextSpawn <= 0) && (Mathf.Abs(GameManager.DistanceToPlayerInX(this.transform)) < ActivationThresholdM))
        {
            SpawnZombie();
            mTimeToNextSpawn = SpawnPeridoSecs;
        }
    }

    private void SpawnZombie()
    {
        GameObject newObj = GameObject.Instantiate(this.PrefabZombie, this.transform.position, Quaternion.identity);
        LookDirection dir = newObj.GetComponent<LookDirection>();
        dir.LookLeft = GameManager.DistanceToPlayerInX(this.transform) < 0;
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ZombieSpawnPoint : MonoBehaviour
{
    public GameObject PrefabZombie;
    public float SpawnPeridoSecs = 10;

    private float mTimeToNextSpawn = 0;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        mTimeToNextSpawn -= Time.deltaTime;
        if (mTimeToNextSpawn <= 0)
        {
            SpawnZombie();
            mTimeToNextSpawn = SpawnPeridoSecs;
        }
    }

    private void SpawnZombie()
    {
        GameObject.Instantiate(this.PrefabZombie, this.transform.position, Quaternion.identity);
    }
}
